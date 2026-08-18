import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('TaskFlow Kanban App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Kanban board columns and initial seed tasks', async () => {
    render(<App />);
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('opens creation modal and creates a new task', async () => {
    render(<App />);
    const newBtn = screen.getByRole('button', { name: /\+ new task/i });
    fireEvent.click(newBtn);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Implement OAuth Flow/i);
    fireEvent.change(titleInput, { target: { value: 'New Test Feature' } });

    const submitBtn = screen.getByRole('button', { name: /^create task$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('New Test Feature')).toBeInTheDocument();
    });
  });

  it('filters task cards by search query', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent query' } });

    await waitFor(() => {
      expect(screen.queryByText('New Test Feature')).not.toBeInTheDocument();
    });
  });
});