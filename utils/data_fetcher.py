import yfinance as yf
import pandas as pd
from datetime import datetime

def fetch_pair_data(ticker1, ticker2, start='2015-01-01', end=None):
    """Fetch historical data for a pair."""
    if end is None:
        end = datetime.now().strftime('%Y-%m-%d')
    data1 = yf.download(ticker1, start=start, end=end, progress=False)
    data2 = yf.download(ticker2, start=start, end=end, progress=False)
    df = pd.DataFrame({
        ticker1: data1['Close'],
        ticker2: data2['Close']
    }).dropna()
    return df

def fetch_multiple_tickers(tickers, start='2015-01-01'):
    data = yf.download(tickers, start=start, progress=False)['Close']
    return data.dropna()
