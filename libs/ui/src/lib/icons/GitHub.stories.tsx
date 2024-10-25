import type { Meta, StoryObj } from '@storybook/react';
import { GitHubIcon } from './GitHub';

const meta: Meta<typeof GitHubIcon> = {
  component: GitHubIcon,
  title: 'Icons/GitHub',
  args: {
    className: 'w-20 h-20 bg-blue-500',
    color: 'white',
  },
};
export default meta;
type Story = StoryObj<typeof GitHubIcon>;

export const Primary: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col h-40 w-full justify-center items-center gap-x-10 bg-medium">
      <GitHubIcon {...args} />
    </div>
  ),
};
