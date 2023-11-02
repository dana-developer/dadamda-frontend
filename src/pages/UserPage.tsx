import styled from 'styled-components';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

import theme from '@/assets/styles/theme';
import defaultUserImage from '@/assets/images/Avatar.png';
import { useLogout } from '@/hooks/useAccount';
import { useModal } from '@/hooks/useModal';
import { useGetUserInformation } from '@/api/user';
import { useConvertUnixTimeToDateFormat, useGetDaysDiff } from '@/hooks/useCalculateDateDiff';

import { DarkWaveVector, EditPencilSquareIcon, LightWaveVector } from '@/components/atoms/Icon';

function UserPage() {
    const { userInformation, isGetUserInformationLoading } = useGetUserInformation();

    const { openModal } = useModal();
    const handleLogout = useLogout();

    if (isGetUserInformationLoading) {
        return <div>로딩중</div>;
    }

    const { profileUrl, name, provider, nickname, createdAt } = userInformation;

    const createdDateInDateFormat = useConvertUnixTimeToDateFormat(createdAt);
    const daysDiffFromCreatedDate = useGetDaysDiff(createdAt);
    const daysDiffInfoString = `(+ 가입한 지 ${daysDiffFromCreatedDate}일이 지났습니다.)`;
    const providerInfoString = `${provider} 계정으로 가입되셨습니다.`;

    function userPageMenuNameAndContent(
        name: string,
        content: string | number | string[]
    ) {
        return { name, content };
    }

    function CreatedDateInfo() {
        return <Box
            sx={{
                display: 'flex',
                alignItems: {
                    xs: 'flex-start',
                    sm: 'center',
                },
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                gap: {
                    xs: '0',
                    sm: '4px',
                }
            }}
        >
            <Typography
                sx={{
                    ...userPageMenuTypographyStyle,
                    fontWeight: '400',
                }}
            >
                {createdDateInDateFormat}
            </Typography>
            <Typography
                sx={countDiffFromCreatedDateTypographyStyle}
            >
                {daysDiffInfoString}
            </Typography>
        </Box>
    }

    const userPageMenus = [
        userPageMenuNameAndContent('이름', name),
        userPageMenuNameAndContent('닉네임', nickname),
        userPageMenuNameAndContent('가입날짜', [createdDateInDateFormat, daysDiffInfoString]),
        userPageMenuNameAndContent('연결된 소셜 계정', providerInfoString),
    ];

    const userPageMenuTypographyStyle = {
        color: theme.color.Gray_090,
        fontSize: '16px',
        lineHeight: '150%',
    };

    const countDiffFromCreatedDateTypographyStyle = {
        color: theme.color.Gray_080,
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '150%',
    };

    return (
        <Wrapper>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '-20px',
                    overflow: 'hidden',
                }}
            >
                <LightWaveVector />
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '-20px',
                    overflow: 'hidden',
                }}
            >
                <DarkWaveVector />
            </Box>
            <Box
                sx={{
                    maxWidth: '580px',
                    width: '100%',
                }}
            >
                <UserInfoWrapper>
                    <ProfileContainer>
                        {profileUrl
                            ? <ProfileImage src={profileUrl} />
                            : <ProfileImage src={defaultUserImage} />
                        }
                    </ProfileContainer>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            width: '100%',
                            p: {
                                xs: '120px 16px 20px 16px',
                                sm: '120px 0px 20px 80px',
                            },
                            boxSizing: 'border-box',
                        }}
                    >
                        <TableContainer component={Box}
                            sx={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                            }}
                        >
                            <Table>
                                <TableBody>
                                    {userPageMenus.map((menu) => (
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    ...userPageMenuTypographyStyle,
                                                    fontWeight: '600',
                                                    border: 'none',
                                                    p: '7px 20px 7px 0',
                                                    width: 'max-content',
                                                }}
                                            >
                                                {menu.name}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    ...userPageMenuTypographyStyle,
                                                    fontWeight: '400',
                                                    border: 'none',
                                                    p: '7px 0px',
                                                }}
                                            >
                                                {typeof (menu.content) === 'string'
                                                    ? menu.content
                                                    : <CreatedDateInfo />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Button
                        variant='outlined'
                        startIcon={<EditPencilSquareIcon width='17' height='17' fill={theme.color.Blue_080} />}
                        sx={{
                            mb: '32px',
                        }}
                    >
                        프로필 수정하기
                    </Button>
                </UserInfoWrapper>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '8px',
                        mt: '20px',
                        width: '100%',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        onClick={handleLogout}
                        sx={{
                            color: 'white',
                            backgroundColor: theme.color.Gray_070,
                            '&:hover': {
                                backgroundColor: theme.color.Gray_080,
                            }
                        }}
                    >
                        로그아웃
                    </Button>
                    <Button
                        onClick={() => openModal('userDelete')}
                        sx={{
                            color: theme.color.Gray_080,
                            backgroundColor: 'transparent',
                            border: `1px solid ${theme.color.Gray_060}`,
                        }}
                    >
                        탈퇴하기
                    </Button>
                </Box>
            </Box >
        </Wrapper >
    );
}

const Wrapper = styled.div`
    width: 100%;
    height: calc(100vh - 56px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
`

const ProfileContainer = styled.div`
    position: absolute;
    top: -25%;
`

const ProfileImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 100%;
`

const UserInfoWrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background-color: ${theme.color.Gray_020};
    border-radius: 8px;
    position: relative;
`

export default UserPage;
