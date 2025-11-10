// Mock API function - replace with your actual API call
export async function fetchDashboardData() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    stats: [
      { label: 'Total Users', value: '1,234' },
      { label: 'Active Sessions', value: '567' },
      { label: 'Revenue', value: '$12,345' },
      { label: 'Growth', value: '+23%' },
    ],
  };
}
