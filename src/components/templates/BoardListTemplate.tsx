import styled from 'styled-components';

import { Box } from '@mui/material';
import BoardListHeader from '@/components/molcules/BoardListHeader';
import theme from '@/assets/styles/theme';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useGetBoardList } from '@/api/board';

function BoardListTemplate() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const { data, isLoading } = useInfiniteQuery(
        ['boards'],
        ({ pageParam = 0 }) => {
            return token && useGetBoardList({ pages: pageParam, size: 30 })
        },
        {
            getNextPageParam: (lastPage) => {
                const nextPage = !lastPage.data.last ? lastPage.data.pageable.pageNumber + 1 : undefined;
                return nextPage;
            },
        }
    );

    if (isLoading) {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                로딩중
            </Box>
        )
    }

    return (
        <>
            <ScrapListContainer>
                <BoardListHeader count={1} />
                <Box
                    sx={{
                        height: 'calc(100% - 145px)',
                    }}
                >
                    {data?.pages.map((page) => {
                        return page.data.content.map((board) => {
                            return (
                                <Box
                                    sx={{
                                        width: '320px',
                                        height: '180px',
                                        backgroundColor: theme.color.Blue_090,
                                    }}
                                    onClick={() => navigate(`/board_info?boardId=${board.boardId}`)}
                                >
                                    {board.title}
                                </Box>
                            )
                        })
                    })}
                </Box>
            </ScrapListContainer>
        </>
    );
}

const ScrapListContainer = styled.div`
    width: calc(100% - 209px);
    height: calc(100% - 56px);
    background-color: linear-gradient(114deg, #EBEEF3 12.12%, #D6DEEA 100%);
    position: fixed;
    right: 0;
    top: 56px;
    @media screen and (max-width: 600px) {
      width: 100vw;
      left: 0;
    }
    display: flex;
    flex-direction: column;
    overflow: auto;
`

export default BoardListTemplate;
