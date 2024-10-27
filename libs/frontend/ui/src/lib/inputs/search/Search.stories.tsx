import type { Meta, StoryObj } from '@storybook/react';
import { Search } from './Search';

const meta: Meta<typeof Search> = {
  component: Search,
  title: 'Search',
  args: {
    className: '',
    autoFocus: true,
    placeholder: 'Search products, brands, etc',
  },
};
export default meta;
type Story = StoryObj<typeof Search>;

export const Primary: Story = {
  render: (args) => (
    <div className="flex flex-col h-40 w-full justify-center items-center gap-x-10 bg-medium">
      <Search {...args} className='w-96 bg-primary' />
    </div>
  ),
};

