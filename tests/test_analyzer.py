import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"src"))
from analyzer import analyze
class TestEvidence(unittest.TestCase):
 def test_timeouts(self):
  r=analyze("Sep 14 12:33:06.442 WARN audio-forwarding Ping Pong Monitor timeout")
  self.assertEqual(r["counts"]["audio_keepalive_timeout"],1)
 def test_stages(self):
  r=analyze("Sep 14 16:05:11.884 INFO CHECK_START_CALL\nSep 14 16:05:12.006 INFO START_CALL")
  self.assertEqual(r["counts"]["check_start_call"],1)
  self.assertEqual(r["counts"]["start_call"],1)
 def test_limits(self):
  self.assertIn("Not established",analyze("")["diagnosis"])
if __name__=="__main__":unittest.main()
