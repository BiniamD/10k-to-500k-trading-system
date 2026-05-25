import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller
from sklearn.linear_model import LinearRegression

class PairsTradingStrategy:
    def __init__(self, lookback=100, entry_z=2.0, exit_z=0.5, risk_per_trade=0.02):
        self.lookback = lookback
        self.entry_z = entry_z
        self.exit_z = exit_z
        self.risk_per_trade = risk_per_trade
    
    def find_cointegration(self, price1, price2):
        """Test for cointegration."""
        # Simple OLS hedge ratio
        model = LinearRegression().fit(price1.values.reshape(-1,1), price2.values)
        hedge_ratio = model.coef_[0]
        spread = price2 - hedge_ratio * price1
        # ADF test
        adf = adfuller(spread)
        return bool(adf[1] < 0.05), hedge_ratio  # p-value < 0.05
    
    def generate_signals(self, df, ticker1, ticker2):
        """Generate trading signals."""
        price1 = df[ticker1]
        price2 = df[ticker2]
        
        # Rolling hedge
        hedge = price1.rolling(self.lookback).apply(
            lambda x: LinearRegression().fit(x.values.reshape(-1,1), 
                                           price2.loc[x.index]).coef_[0] if len(x)>10 else np.nan
        )
        
        spread = price2 - hedge * price1
        mean_spread = spread.rolling(self.lookback).mean()
        std_spread = spread.rolling(self.lookback).std()
        zscore = (spread - mean_spread) / std_spread
        
        signals = pd.DataFrame(index=df.index)
        signals['zscore'] = zscore
        signals['long_spread'] = (zscore < -self.entry_z) & (zscore.shift(1) >= -self.entry_z)
        signals['short_spread'] = (zscore > self.entry_z) & (zscore.shift(1) <= self.entry_z)
        signals['exit'] = abs(zscore) < self.exit_z
        
        return signals, hedge
