import yfinance as yf
import pandas as pd
from datetime import datetime


def _extract_close_series(downloaded, ticker):
    if isinstance(downloaded, pd.Series):
        return downloaded.rename(ticker)

    if not isinstance(downloaded, pd.DataFrame) or downloaded.empty:
        return pd.Series(dtype=float, name=ticker)

    if isinstance(downloaded.columns, pd.MultiIndex):
        if ("Close", ticker) in downloaded.columns:
            return downloaded[("Close", ticker)].rename(ticker)
        if "Close" in downloaded.columns.get_level_values(0):
            close_frame = downloaded.xs("Close", axis=1, level=0)
            if ticker in close_frame.columns:
                return close_frame[ticker].rename(ticker)
            if close_frame.shape[1] == 1:
                return close_frame.iloc[:, 0].rename(ticker)
        return pd.Series(dtype=float, name=ticker)

    if "Close" in downloaded.columns:
        return downloaded["Close"].rename(ticker)

    return pd.Series(dtype=float, name=ticker)


def fetch_pair_data(ticker1, ticker2, start='2015-01-01', end=None):
    """Fetch historical data for a pair."""
    if end is None:
        end = datetime.now().strftime('%Y-%m-%d')
    try:
        data1 = yf.download(ticker1, start=start, end=end, progress=False)
        data2 = yf.download(ticker2, start=start, end=end, progress=False)
    except Exception:
        return pd.DataFrame(columns=[ticker1, ticker2])

    close1 = _extract_close_series(data1, ticker1)
    close2 = _extract_close_series(data2, ticker2)
    df = pd.concat([close1, close2], axis=1).dropna()
    return df if not df.empty else pd.DataFrame(columns=[ticker1, ticker2])

def fetch_multiple_tickers(tickers, start='2015-01-01'):
    data = yf.download(tickers, start=start, progress=False)['Close']
    return data.dropna()
