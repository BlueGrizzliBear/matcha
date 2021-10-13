import { Menu } from '@mui/material';
import { MenuItemMessage, MenuItemLike, MenuItemWatch, MenuItemLoad, MenuItemEmpty } from './NavBarMenu'

export default function Notifications(props) {

	return (
		<Menu
			id="notifications-menu"
			{...props}
			sx={{ width: '100%', maxWidth: 360 }}>
			{
				props.isloading === true ?
					<MenuItemLoad key="1" />
					:
					props.notifications.slice().reverse().map((item, i) => (
						(item.message_id) ?
							<MenuItemMessage i={i} key={i} to={"/profile/" + item.sender} notifications={props.notifications} item={item} />
							: (item.like_id ?
								<MenuItemLike i={i} key={i} to={"/profile/" + item.sender} notifications={props.notifications} item={item} />
								: (item.watch_id ?
									<MenuItemWatch i={i} key={i} to={"/profile/" + item.sender} notifications={props.notifications} item={item} />
									:
									<MenuItemEmpty key={i} />
								)
							)
					))
			}
		</Menu>
	)
}
