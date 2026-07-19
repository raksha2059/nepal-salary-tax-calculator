export const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '6px',
    border: state.isFocused ? '1.5px solid #1B4F8A' : '1.5px solid #CBD5E1',
    boxShadow: 'none',
    padding: '2px 4px',
    fontSize: '15px',
    backgroundColor: '#fff',
    '&:hover': { borderColor: '#1B4F8A' },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#1B4F8A' : state.isFocused ? '#EFF6FF' : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    fontSize: '15px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    border: '1px solid #e2e8f0',
  }),
};