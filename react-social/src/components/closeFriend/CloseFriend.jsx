import "./closeFriend.css"

export default function ({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <div>
            <li className="sidebarFriend">
                <img src={PF+user.profilePicture} alt="" className="sidebarFriendImg" />
                <span className="sidebarFriendName">{user.username}</span>
            </li>
        </div>
    )
}
