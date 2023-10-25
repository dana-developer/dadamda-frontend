import { Box, CircularProgress } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";

import { useGetScrapByType } from "@/api/scrap";
import { useGetScrapSearchResultByType } from "@/api/search";
import { useGetToken } from "@/hooks/useAccount";

import EmptyScrapContainer from "@/components/organisms/EmptyScrapContainer";
import CategoryInfo from "@/components/organisms/ExistCategoryScrapContainer/CategoryInfo";
import CategoryList from "@/components/organisms/ExistCategoryScrapContainer/CategoryList";

function ColumnListTemplate({ type }: { type: string }) {
    const token = useGetToken();
    const size = 30;
    const [searchParams, setSearchParams] = useSearchParams();

    function isSearchTemplate() {
        return searchParams.has('keyword');
    }

    function getKeyword() {
        return searchParams.get('keyword');
    }

    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
        ['scraps', type, getKeyword()],
        ({ pageParam = 0 }) => {
            return token && (isSearchTemplate()
                ? useGetScrapSearchResultByType({ type: type, pages: pageParam, size: size, token: token, keyword: getKeyword() })
                : useGetScrapByType({ type: type, pages: pageParam, size: size, token: token })
            )
        },
        {
            getNextPageParam: (lastPage) => {
                const nextPage = !lastPage.data.last ? lastPage.data.pageable.pageNumber + 1 : undefined;
                return nextPage;
            },
        }
    );

    const [scrapId, setScrapId] = useState<string | null>(null);

    useEffect(() => {
        setScrapId(searchParams.get('scrapId'));
    }, [searchParams])

    if (isLoading) {
        return (
            <CircularProgress
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        )
    }

    if (data?.pages[0].data.content.length === 0) {
        return <EmptyScrapContainer />
    }

    return (
        <Box
            sx={{
                height: '100%',
                pb: '10px',
                boxSizing: 'border-box',
            }}
        >
            <Desktop>
                <Box
                    sx={{
                        width: { xs: '100%', md: '237px' },
                        height: '100%',
                        overflow: 'auto',
                        pb: '24px',
                        boxSizing: 'border-box',
                    }}
                >
                    <CategoryList data={data} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />
                </Box>
                <CategoryInfo data={data} scrapId={scrapId ? +scrapId : data?.pages[0].data.content[0].scrapId} />
            </Desktop >
        </Box>
    )
}

const Desktop = styled.div`
    padding: 0 24px;
    gap: 24px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
`

export default ColumnListTemplate;
