import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import styled from 'styled-components';

const StyledBlockWrapper = styled.div`
  position: relative;
  background: yellow;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  cursor: move;
  &:hover {
  }
`;

const BoardWrapper = styled.div`
  border: 2px solid #000;
  min-height: 30px;
`;
const sortableOptions = {
  animation: 1000,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  group: 'shared',
  forceFallback: true,
};

const Board = ({ children }) => {
  return <BoardWrapper>{children}</BoardWrapper>;
};

const Tile = ({ id, name }) => {
  return <StyledBlockWrapper>{name}</StyledBlockWrapper>;
};

const Test = () => {
  const [boards, setBoards] = useState([
    { id: 'board-1', items: [] },
    { id: 'board-2', items: [] },
    { id: 'board-3', items: [] },
    {
      id: 'board-4',
      items: [
        { id: 1, name: 'Component 1', board_id: 'board-4' },
        { id: 2, name: 'Component 2', board_id: 'board-4' },
        { id: 3, name: 'Component 3', board_id: 'board-4' },
      ],
    },
  ]);

  //每個 board 都會用到這個公式
  //每次觸發時，都去比較是否為當下的 board，是的話就更新 items 的狀況

  const handleSortEnd = (boardId, items) => {
    console.log(boardId);
    if (items.length > 0) {
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id === boardId) {
            return { ...board, items };
          }
          return board;
        })
      );
    }
  };

  return (
    <>
      {boards.map((board) => (
        <Board key={board.id}>
          <ReactSortable
            {...sortableOptions}
            setList={(items) => handleSortEnd(board.id, items)}
            list={board.items}
          >
            {board.items.map((item) => (
              <Tile key={item.id} id={item.id} name={item.name} />
            ))}
          </ReactSortable>
        </Board>
      ))}
    </>
  );
};

export default Test;
