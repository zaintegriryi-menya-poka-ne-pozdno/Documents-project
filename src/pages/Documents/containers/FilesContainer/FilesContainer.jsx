

import React, { useEffect, useState } from 'react';

// utils
import { FilesData } from './FilesData';

// styles
import {
  Container,
  ContainerHeader,
  ContainerLeft,
  ContainerRight,
  ContainerCenter,
  InputSearch,
  DownloadButton
} from '../Contract/DocsContainer.style';

// components




const FilesContainer = ({ dataDocs }) => {
  const [files, setFiles] = useState([]);
  const [fakeData, setFakeData] = useState(false);
  
  useEffect(() => {
    if (dataDocs && dataDocs.docs) {
      const sortedFiles = [...dataDocs.docs];
      if (sortedFiles.length > 0) {
        sortedFiles.sort((a, b) => b.timestamp - a.timestamp);

        // Assign sequential data-list-id
        const filesWithIds = sortedFiles.map((file, index) => ({
          ...file,
          dataListId: index + 1
        }));

        setFiles(filesWithIds);
        setFakeData(false);
      } else {
        setFiles([]);
        setFakeData(true);
      }
    } else {
      setFiles([]);
      setFakeData(true);
    }
  }, [dataDocs]);

  if (files === null) {
    return null;
  }

  const getMaxTimestampFile = (files) => {
    if (!Array.isArray(files) || files.length === 0) {
      return null;
    }
    return files.reduce((latest, file) => file.timestamp > latest.timestamp ? file : latest, files[0]);
  };

  const latestFile = getMaxTimestampFile(files);

  return (
    <div style={{
      maxHeight: '150px',
      overflowY: 'auto'
    }}>
      {files !== null && files.map((file, index) => (
        <ContainerHeader
          className={'list__row' + ` data-list_${file.dataListId}`}
          key={index}
          style={{
            display: 'flex',
            backgroundColor: file.timestamp === latestFile.timestamp ? '#E2E2E0' : 'transparent',
            borderRadius: '4px',
            marginTop: '5px',
            padding: '5px',
            boxSizing: 'border-box',
          }}
        >
          <ContainerLeft style={{ flex: '2 1 0', display: 'block', paddingLeft: '5px' }}>
            <p
              className='list__row__title'
              style={{ fontSize: '13px', }}
            >
              {file.name}
            </p>
            <p
              className='list__row__date'
              style={{ fontSize: '12px' }}
            >
              {new Date(file.timestamp * 1000).toLocaleString()}
            </p>
          </ContainerLeft>

          <ContainerCenter style={{ flex: '4 1 0', display: 'block', textAlign: 'right' }}>
            <p style={{ fontSize: '12px' }}>
              {file.budget ? `${file.for} ← ${file.budget} ₽` : `→ ${file.for}`}
            </p>
            <p style={{ fontSize: '11px' }}>{file.author}</p>
          </ContainerCenter>
          
          <ContainerRight style={{ flex: '1 1 0' }}>
            <a href={file.link} target="_blank" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <DownloadButton>
                <img src="https://test-widget-9417.website/prod_projects/nortec/docs-maker/data/download_icon.png" alt="Open" style={{ width: '16px', height: '16px' }} />
              </DownloadButton>
            </a>
          </ContainerRight>
        </ContainerHeader>
      ))}

      {fakeData && <p style={{ marginTop: '5px' }}>Документы отсутствуют</p>}
    </div>
  );
};

export default FilesContainer;
