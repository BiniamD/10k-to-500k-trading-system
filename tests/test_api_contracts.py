import json
import unittest
from unittest.mock import patch

import pandas as pd

from backend.dashboard_service import get_backtest_summary, get_dashboard_snapshot


class TestApiContracts(unittest.TestCase):
    @patch("backend.dashboard_service.fetch_pair_data")
    def test_dashboard_snapshot_schema_and_serialization(self, mock_fetch_pair_data):
        dates = pd.date_range("2024-01-01", periods=180)
        ko = pd.Series(range(60, 240), index=dates, dtype=float)
        pep = ko * 1.05 + 2
        mock_fetch_pair_data.return_value = pd.DataFrame({"KO": ko, "PEP": pep})

        snapshot = get_dashboard_snapshot(force_refresh=True)

        self.assertIn("header", snapshot)
        self.assertIn("equity", snapshot)
        self.assertIn("regime", snapshot)
        self.assertIn("performance", snapshot)
        self.assertIn("orderFlow", snapshot)
        self.assertIn("positions", snapshot)
        self.assertIn("insights", snapshot)
        self.assertIn("meta", snapshot)

        serialized = json.dumps(snapshot)
        self.assertIsInstance(serialized, str)
        deserialized = json.loads(serialized)
        self.assertIn("header", deserialized)
        self.assertIn("meta", deserialized)

    @patch("backend.dashboard_service.fetch_pair_data")
    def test_backtest_summary_uses_contract_data(self, mock_fetch_pair_data):
        dates = pd.date_range("2024-01-01", periods=120)
        ko = pd.Series(range(50, 170), index=dates, dtype=float)
        pep = ko * 1.03 + 4
        mock_fetch_pair_data.return_value = pd.DataFrame({"KO": ko, "PEP": pep})

        summary = get_backtest_summary()
        self.assertIn("ticker1", summary)
        self.assertIn("ticker2", summary)
        self.assertIn("totalReturnPercent", summary)
        self.assertIn("benchmarkReturnPercent", summary)

    @patch("backend.dashboard_service.fetch_pair_data")
    def test_dashboard_snapshot_falls_back_when_market_data_empty(self, mock_fetch_pair_data):
        mock_fetch_pair_data.return_value = pd.DataFrame(columns=["KO", "PEP"])

        snapshot = get_dashboard_snapshot(force_refresh=True)

        self.assertIn("header", snapshot)
        self.assertIn("equity", snapshot)
        self.assertGreater(snapshot["meta"]["dataPoints"], 0)


if __name__ == "__main__":
    unittest.main()
