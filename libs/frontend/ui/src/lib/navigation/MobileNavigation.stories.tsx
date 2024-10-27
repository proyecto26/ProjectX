import type { Meta, StoryObj } from '@storybook/react';
import { MobileNavigation } from './MobileNavigation';
import { withRouterProvider } from '../providers/router';

const meta: Meta<typeof MobileNavigation> = {
  component: MobileNavigation,
  title: 'Navigation/Mobile',
  args: {
    sections: [
      {
        title: 'Home',
        links: [{ title: 'Home', href: '/' }],
      },
      {
        title: 'About',
        links: [{ title: 'About', href: '/about' }],
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof MobileNavigation>;

const MobileNavigationWithProviders = withRouterProvider(MobileNavigation);

export const Primary: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col h-40 w-full justify-start gap-x-10 bg-medium">
      <MobileNavigationWithProviders {...args} />
    </div>
  ),
};