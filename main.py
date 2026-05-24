#!/usr/bin/env python3
"""
Complete Trading System Entry Point
"""

from utils.data_fetcher import fetch_pair_data
from strategies.pairs_trading import PairsTradingStrategy
from backtests.backtest_pairs import run_full_backtest
import matplotlib.pyplot as plt
import pandas as pd

def main():
    print("=== Trading System Starting: 10k -> 500k Blueprint ===")
    print("Fetching data for KO-PEP pair...")
    
    df, signals, trades = run_full_backtest()
    
    print("\n=== Performance Summary ===")
    print("Strategy: Pairs Trading with Z-Score")
    print("Risk Management: 2% per trade max")
    print("Goal: Compound to 50x via consistent edge + reinvestment")
    print("\nNext Steps:")
    print("1. Run full optimization")
    print("2. Paper trade")
    print("3. Monitor live")
    
    # Plot (save)
    # plt.figure(figsize=(12,6))
    # ... (add plots)
    print("System ready. See README for details.")

if __name__ == "__main__":
    main()
