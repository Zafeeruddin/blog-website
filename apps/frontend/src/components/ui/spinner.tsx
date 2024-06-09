import { SyncLoader } from 'react-spinners';

export default function Loader() {
	return (
		<div className='flex items-center justify-center h-screen align-middle'>
			<SyncLoader color='#5164ce' size={15} />
		</div>
	);
}