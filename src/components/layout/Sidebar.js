import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="material-icons">school</span>
        <h2>Planner Académico</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><Link href="/"><span className="material-icons">dashboard</span> Dashboard</Link></li>
          <li><Link href="/tasks"><span className="material-icons">list_alt</span> Tareas</Link></li>
          <li><Link href="/calendar"><span className="material-icons">calendar_today</span> Calendario</Link></li>
        </ul>
      </nav>
    </aside>
  );
};
export default Sidebar;