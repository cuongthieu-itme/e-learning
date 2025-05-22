import NavBanner from './NavBanner';
import NavActions from './actions/NavActions';

const Header: React.FC = () => {
  return (
    <header>
      <NavBanner />
      <NavActions />
    </header>
  );
};

export default Header;
