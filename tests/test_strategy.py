import unittest
import pandas as pd
import numpy as np
from strategies.pairs_trading import PairsTradingStrategy

class TestPairsStrategy(unittest.TestCase):
    def setUp(self):
        self.strategy = PairsTradingStrategy(lookback=20)
        dates = pd.date_range('2020-01-01', periods=100)
        self.df = pd.DataFrame({
            'KO': np.random.randn(100).cumsum() + 50,
            'PEP': np.random.randn(100).cumsum() + 55
        }, index=dates)
    
    def test_signals_generation(self):
        signals, hedge = self.strategy.generate_signals(self.df, 'KO', 'PEP')
        self.assertIn('zscore', signals.columns)
        self.assertFalse(signals.empty)
    
    def test_cointegration(self):
        is_coin, ratio = self.strategy.find_cointegration(self.df['KO'], self.df['PEP'])
        self.assertIsInstance(is_coin, bool)

if __name__ == '__main__':
    unittest.main()
