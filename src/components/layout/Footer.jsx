import { Link } from 'react-router-dom';
import logoSvg from '../../assets/icons/logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Staking', path: '/staking' },
      ]
    },
    {
      title: 'Marketplace',
      links: [
        { name: 'NFTs', path: '/marketplace' },
        { name: 'Bonds', path: '/marketplace/bonds' },
        { name: 'My Collection', path: '/marketplace/collection' },
        { name: 'My Bonds', path: '/marketplace/my-bonds' },
        { name: 'My Requests', path: '/marketplace/my-requests' },
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Profile', path: '/profile' },
        { name: 'Settings', path: '/settings' },
        { name: 'Connect Wallet', path: '/connect-wallet' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: '/docs' },
        { name: 'Whitepaper', path: '/whitepaper' },
        { name: 'Support', path: '/support' },
        { name: 'FAQs', path: '/faq' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', path: 'https://twitter.com/oriro_dao', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ) },
    { name: 'GitHub', path: 'https://github.com/oriro-dao', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ) },
    { name: 'Discord', path: 'https://discord.gg/oriro', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ) },
    { name: 'Telegram', path: 'https://t.me/oriro_dao', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ) },
    { name: 'Medium', path: 'https://medium.com/@oriro-dao', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    ) }
  ];

  const renderLink = (link) => {
    if (link.external) {
      return (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // You can add a toast or modal here indicating these are coming soon
            console.log(`${link.name} - Coming Soon!`);
          }}
          className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors cursor-pointer"
        >
          {link.name}
        </a>
      );
    }
    
    return (
      <Link
        to={link.path}
        className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors"
      >
        {link.name}
      </Link>
    );
  };

  return (
    <footer className="bg-white dark:bg-dark-darker pt-16 pb-12 border-t border-slate-200 dark:border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-10"
                src={logoSvg}
                alt="Oriro"
              />
              <span className="ml-2 text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                oriro
              </span>
            </Link>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-md">
              A decentralized autonomous organization (DAO) platform featuring secure governance, 
              multi-chain infrastructure, NFT and bond marketplace, and DeFi services.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                &copy; {currentYear} Oriro DAO. All rights reserved.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-2 md:mt-0">
                Built on Ethereum & Multi-chain Infrastructure
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end space-x-6">
              <Link to="/privacy" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors">
                Cookie Policy
              </Link>
              <Link to="/contact" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 