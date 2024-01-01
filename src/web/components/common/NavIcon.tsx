import Icon from './Icon';

export const NavIcon = ({ isSelected, icon, onClick }: { isSelected: boolean; icon: string; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className='group cursor-pointer inline-flex flex-col items-center justify-center font-medium px-5 bg-default-hover'>
      <Icon icon={icon} className={`w-6 h-6 mb-1 ${isSelected ? 'fill-gray-300' : 'fill-gray-500'}`} />
    </div>
  );
};
