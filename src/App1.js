import { useState } from 'react'
// import './App.scss'
import avatar from './images/2.png'
const list = []

const user = {
  avatar,
  uid: 18,
  uname: '黑马前端',
}
const tabs = [

]
function App() {
  const [commentList, setCommentList] = useState(list)
  return (
    <div className="App">
      {/** 导航Tab */}
      <div className='replynavigation'></div>

      <div className='replywrap'>
        {/** 发表评论 */}
        <div className='reply-normal'>
          回复
        </div>
        {/** 评论项 */}
        <div className='reply-list'>
          <div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default MyApp;
