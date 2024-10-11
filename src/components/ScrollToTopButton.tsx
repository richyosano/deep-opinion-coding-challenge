import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUpRounded';

interface ScrollToTopButtonProps {
	currentScrollPosition: number;
	itemHeight: number;
	scrollToTop: () => void;
}

export const ScrollToTopButton = ({
	currentScrollPosition,
	itemHeight,
	scrollToTop,
}: ScrollToTopButtonProps) => (
	<Zoom in={currentScrollPosition > itemHeight} timeout={300} unmountOnExit>
		<Tooltip title='Scroll to top' placement='top'>
			<Fab
				color='primary'
				size='medium'
				variant='circular'
				sx={{
					position: 'fixed',
					bottom: 70,
					right: 45,
					zIndex: 10,
					backgroundColor: '#4186cb',
					boxShadow: 0,
				}}
				onClick={scrollToTop}
				data-testid='scrollToTop'
			>
				<ArrowUpIcon />
			</Fab>
		</Tooltip>
	</Zoom>
);
