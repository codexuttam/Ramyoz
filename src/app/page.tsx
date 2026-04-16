import Board from '@/components/kanban/Board';
import HydrationZustand from '@/components/HydrationZustand';

export const metadata = {
  title: 'Next Kanban | Premium Workflow Manager',
  description: 'Manage your tasks with a beautiful, high-performance Kanban board.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HydrationZustand>
        <Board />
      </HydrationZustand>
    </main>
  );
}
