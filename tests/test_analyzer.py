import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from analyzer import analyze


class TestEvidence(unittest.TestCase):
    def test_timeouts(self):
        result = analyze("Sep 14 12:33:06.442 WARN audio-forwarding Ping Pong Monitor timeout")
        self.assertEqual(result["counts"]["audio_keepalive_timeout"], 1)

    def test_stages(self):
        result = analyze("Sep 14 16:05:11.884 INFO CHECK_START_CALL\nSep 14 16:05:12.006 INFO START_CALL")
        self.assertEqual(result["counts"], {"check_start_call": 1, "start_call": 1})

    def test_no_diagnosis_inferred(self):
        self.assertIn("Not established", analyze("")["diagnosis"])

    def test_explicit_offset_normalizes_and_preserves_source(self):
        source = "2026-09-14T16:05:12.006+05:30"
        event = analyze(source + " INFO START_CALL")["events"][0]
        self.assertEqual(event["utc"], "2026-09-14T10:35:12.006Z")
        self.assertEqual(event["source_timestamp"], source)
        self.assertEqual(event["timestamp_status"], "explicit_timezone")

    def test_zulu_timestamp(self):
        self.assertEqual(analyze("2026-09-14T12:00:00Z INFO START_CALL")["events"][0]["utc"], "2026-09-14T12:00:00Z")

    def test_unknown_timezones_are_not_utc(self):
        for source, status in [("Sep 14 16:05:12.006", "year_and_timezone_unknown"), ("2026-09-14T16:05:12", "timezone_unknown")]:
            with self.subTest(source=source):
                event = analyze(source + " INFO START_CALL")["events"][0]
                self.assertIsNone(event["utc"])
                self.assertEqual(event["source_timestamp"], source)
                self.assertEqual(event["timestamp_status"], status)

    def test_invalid_timestamp_not_normalized(self):
        event = analyze("2026-99-14T12:00:00Z INFO START_CALL")["events"][0]
        self.assertIsNone(event["utc"])
        self.assertEqual(event["timestamp_status"], "invalid")

    def test_invalid_offsets_and_utc_overflow_remain_unresolved(self):
        sources = [
            "2026-09-14T12:00:00+05:99",
            "2026-09-14T12:00:00+24:00",
            "2026-09-14T12:00:00-0560",
            "0001-01-01T00:00:00+01:00",
            "9999-12-31T23:59:59-01:00",
        ]
        for source in sources:
            with self.subTest(source=source):
                event = analyze(source + " INFO START_CALL")["events"][0]
                self.assertIsNone(event["utc"])
                self.assertEqual(event["source_timestamp"], source)
                self.assertEqual(event["timestamp_status"], "invalid")

    def test_evidence_metadata_and_unclassified_lines(self):
        raw = "Sep 14 12:33:06.442 WARN audio-forwarding Ping Pong Monitor timeout  "
        unknown = "  opaque evidence\t"
        result = analyze(raw + "\r\n" + unknown + "\n\nINFO user socket closed")
        self.assertEqual([line["line_id"] for line in result["lines"]], [1, 2, 3, 4])
        self.assertEqual(result["events"][0]["text"], raw)
        self.assertEqual(result["events"][0]["severity"], "WARN")
        self.assertEqual(result["events"][0]["channel"], "audio")
        self.assertEqual(result["events"][1]["channel"], "control")
        self.assertEqual(result["lines"][1]["text"], unknown)
        self.assertEqual(result["lines"][1]["kind"], "unclassified")
        self.assertEqual(result["lines"][2]["text"], "")
        self.assertNotIn("unclassified", result["counts"])

    def test_input_limits_are_utf8_bytes_and_physical_lines(self):
        analyze("a" * 1048576)
        analyze("\n" * 10000)
        for text in ["a" * 1048577, "é" * 524289, "\n" * 10001]:
            with self.subTest(length=len(text)):
                with self.assertRaises(ValueError):
                    analyze(text)

    def test_cli_errors_are_safe_and_nonzero(self):
        script = str(Path(__file__).resolve().parents[1] / "src" / "analyzer.py")
        result = subprocess.run([sys.executable, script, "/definitely/missing/balto.log"], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Error:", result.stderr)
        self.assertNotIn("Traceback", result.stderr)
        with tempfile.NamedTemporaryFile() as file:
            file.write(b"\xff")
            file.flush()
            result = subprocess.run([sys.executable, script, file.name], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn("Traceback", result.stderr)


if __name__ == "__main__":
    unittest.main()
