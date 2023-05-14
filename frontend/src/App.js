import React, {useEffect, useState} from 'react';
import FileDownload from 'js-file-download';

import './App.css';

function App() {

  const [parent, setParent] = useState('');
  const [data, setData] = useState({
    path:"",
    files:[]
  });

  useEffect(() => {
    fetch("http://localhost:8888/")
    .then(res => res.json())
    .then(
      (result) => {
        setParent('');
        setData(result);
      },
      (error) => {

      }
    )
  }, []);

  const clickHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8888/?path="+event.target.attributes.href.value)
      .then(res => res.json())
      .then(
        (result) => {
          let linkArr = result.path.split('/');
          linkArr.pop();
          setParent(linkArr.join('/'));
          setData(result);
        },
        (error) => {

        }
      )
  }

  const clickDownloadHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8888/?path=" + event.target.attributes.href.value)
    .then(res => res.blob()) 
    .then((res) => {
        const splitArray = event.target.attributes.href.value.split('/');
        FileDownload(res, splitArray[splitArray.length - 1]);
      })
  }

  return (
    <div className="file-manager">

    <div>
      <a href={parent} onClick={clickHandler}>
        <span className='material-icons'>&#xe5d8;</span>
        Level up
      </a>
    </div>

      <div className = "current-level">
        current: {data.path === '' ? '/' : data.path}
      </div>
      <ul className='folder-list'>
        {data.files.map(item => {
          if(item.dir){
            return <li key = {item.name} className = "folder">
              <a href={data.path + '/' + item.name} onClick={clickHandler}>
                <span className='material-icons'>&#xe2c7;</span>
                {item.name.toUpperCase()}
              </a>
              </li>
          }
          else {
            return <li key = {item.name} className = "file">
              <a href={data.path + '/' + item.name} onClick={clickDownloadHandler}>
              <span className='material-icons'>&#xe873;</span>
              {item.name}
              </a>
              </li>
          }
        })}
      </ul>
    </div>
  );
}

export default App;
