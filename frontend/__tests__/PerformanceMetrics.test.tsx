import { render, screen } from '@testing-library/react';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import { useApiData } from '@/frontend/hooks/useApiData';

jest.mock('@/frontend/hooks/useApiData', () => ({
  useApiData: jest.fn(),
}));

describe('PerformanceMetrics', () => {
  beforeEach(() => {
    (useApiData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: {
        metrics: [
          { label: 'Win Rate', value: '68.4%', change: 'up', tone: 'positive' },
          { label: 'Sharpe Ratio', value: '2.4', change: 'up', tone: 'positive' },
          { label: 'Max Drawdown', value: '6.8%', change: 'down', tone: 'positive' },
          { label: 'Profit Factor', value: '2.87', change: 'up', tone: 'positive' },
        ],
      },
    });
  });

  it('renders all key metrics', () => {
    render(<PerformanceMetrics />);
    
    expect(screen.getByText(/Win Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Sharpe Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Drawdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Profit Factor/i)).toBeInTheDocument();
  });
});