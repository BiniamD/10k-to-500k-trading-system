import { render, screen } from '@testing-library/react';
import RegimeMonitor from '@/components/RegimeMonitor';
import { useApiData } from '@/frontend/hooks/useApiData';

jest.mock('@/frontend/hooks/useApiData', () => ({
  useApiData: jest.fn(),
}));

describe('RegimeMonitor', () => {
  beforeEach(() => {
    (useApiData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: {
        state: 'BUSY',
        confidence: 84,
        vpin: 0.55,
        imbalance: 9,
        message: 'Prioritize high-conviction setups and tighten entry thresholds.',
      },
    });
  });

  it('renders without crashing', () => {
    render(<RegimeMonitor />);
    expect(screen.getByText(/Market Regime/i)).toBeInTheDocument();
  });

  it('shows confidence percentage', () => {
    render(<RegimeMonitor />);
    expect(screen.getByText(/Confidence/i)).toBeInTheDocument();
  });
});