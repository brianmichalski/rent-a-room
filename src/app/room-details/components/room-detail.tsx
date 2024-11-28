interface RoomDetailProps {
  attribute: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ attribute, value, prefix, suffix }) => {
  return (
    <ul className="block text-center">
      <li className="text-xs uppercase text-gray-500">
        {attribute}
      </li>
      <li className="font-semibold">{prefix}{value}{suffix}</li>
    </ul>)
}
export default RoomDetail;