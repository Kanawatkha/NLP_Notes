import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

describe('ui primitives', () => {
  it('renders every button variant as a real button with the design radius', () => {
    render(
      <>
        <Button>primary</Button>
        <Button variant="primary-sm">sm</Button>
        <Button variant="green">green</Button>
        <Button variant="dark-square">square</Button>
      </>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByText('primary').className).toContain('rounded-xl');
    expect(screen.getByText('sm').className).toContain('rounded-pill-nav');
    expect(screen.getByText('green').className).toContain('rounded-pill');
    expect(screen.getByText('green').className).toContain('bg-primary');
    expect(screen.getByText('square').className).toContain('rounded-sm');
  });

  it('keeps the everyday primary black and the mint accent to the green variant only', () => {
    render(
      <>
        <Button>primary</Button>
        <Button variant="dark-square">square</Button>
      </>,
    );
    expect(screen.getByText('primary').className).toContain('bg-ink');
    expect(screen.getByText('primary').className).not.toContain('bg-primary');
    expect(screen.getByText('square').className).not.toContain('bg-primary');
  });

  it('renders a ButtonLink as a link', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/midterm" variant="dark-square">
          go
        </ButtonLink>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('href', '/midterm');
  });

  it('gives cards and badges their design shapes', () => {
    render(
      <>
        <Card variant="mint" data-testid="mint">
          x
        </Card>
        <Card data-testid="outlined">y</Card>
        <Badge tone="dark">ข้อ 3</Badge>
        <Badge tone="square">3.1</Badge>
      </>,
    );
    expect(screen.getByTestId('mint').className).toContain('rounded-card');
    expect(screen.getByTestId('mint').className).toContain('rounded-tl-none');
    expect(screen.getByTestId('mint').className).toContain('bg-canvas-mint');
    expect(screen.getByTestId('outlined').className).toContain('border-hairline');
    expect(screen.getByText('ข้อ 3').className).toContain('rounded-full');
    expect(screen.getByText('3.1').className).toContain('rounded-sm');
  });
});
