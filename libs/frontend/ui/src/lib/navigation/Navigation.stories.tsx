import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './Navigation';
import { withRouterProvider } from '../providers/router';

const meta: Meta<typeof Navigation> = {
  component: Navigation,
  title: 'Navigation/Desktop',
  args: {
    sections: [
      {
        title: 'Home',
        links: [{ title: 'Home', href: '/' }],
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Navigation>;

const NavigationWithProviders = withRouterProvider(Navigation);

export const Primary: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col h-40 w-full justify-start gap-x-10 bg-medium">
      <NavigationWithProviders {...args} />
    </div>
  ),
};