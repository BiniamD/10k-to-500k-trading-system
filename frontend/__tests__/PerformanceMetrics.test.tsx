import { render, screen } from '@testing-library/react';
import PerformanceMetrics from '@/components/PerformanceMetrics';

describe('PerformanceMetrics', () => {
  it('renders all key metrics', () => {
    render(<PerformanceMetrics />);
    
    expect(screen.getByText(/Win Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Sharpe Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Drawdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Profit Factor/i)).toBeInTheDocument();
  });
});