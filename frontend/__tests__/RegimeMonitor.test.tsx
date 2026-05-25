import { render, screen } from '@testing-library/react';
import { RegimeMonitor } from '../components/RegimeMonitor';

describe('RegimeMonitor', () => {
  it('renders without crashing', () => {
    render(<RegimeMonitor />);
    expect(screen.getByText(/Market Regime/i)).toBeInTheDocument();
  });

  it('shows confidence percentage', () => {
    render(<RegimeMonitor />);
    expect(screen.getByText(/Confidence/i)).toBeInTheDocument();
  });
});