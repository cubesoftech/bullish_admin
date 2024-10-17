import { useRouter } from 'next/router';
import React from 'react'
import { prisma } from '@/utils';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import useSWR from 'swr';
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Modal, ModalBody, ModalContent, ModalOverlay, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';

export interface Root {
    member: Member
    recentrades: Recentrade[]
    tansactions: Tansaction[]
}

export interface Member {
    email: string
    balance: number
    id: string
}

export interface Recentrade {
    id: string
    timeExecuted: string
    trade: boolean
    tradeAmount: number
    tradePNL: number
    membersId: string
    type: string
}

export interface Tansaction {
    id: string
    type: string
    amount: number
    status: string
    description: string
    membersId: string
    createdAt: string
    updatedAt: string
}


function User({ isOpen, onClose, id }: { isOpen: boolean, onClose: () => void, id: string }) {
    //access the query
    const { data, error, isLoading } = useSWR<Root>(isOpen ? `/api/getUserDetails?id=${id}` : null, async (url: string) => {
        const res = await fetch(url);
        return res.json();
    })
    if (isLoading) {
        return (
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />

                    <DrawerBody>
                        <VStack p={5} h={'100vh'} w={'100%'}>
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                            <Skeleton height={'10vh'} width={'100%'} />
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }
    return (
        <Drawer
            isOpen={isOpen}
            placement='top'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />

                <DrawerBody>
                    <VStack p={5} spacing={2} alignItems={"flex-start"} >
                        <Text fontSize={'large'}>유저아이디: {data?.member?.email}</Text>
                        <Text fontSize={'large'}>잔액: {Number(data?.member?.balance).toLocaleString()} KRW</Text>
                        <Transaction transaction={data?.tansactions} />
                        <Trades trades={data?.recentrades} />
                    </VStack>
                </DrawerBody>

                <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const Transaction = ({ transaction }: { transaction: Tansaction[] | undefined }) => {
    const localTime = (time: string) => {
        return new Date(time).toLocaleString()
    }
    return (
        <VStack p={5} maxH={'40vh'} borderColor={'black'} borderWidth={1} w={'100%'} >
            <Text fontSize={'large'}>Transactions</Text>
            <TableContainer w={'100%'} overflowY={'scroll'}>
                <Table overflow={'scroll'} size={"md"} variant={"striped"} colorScheme="cyan">
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>금액</Th>
                            <Th>상태</Th>
                            <Th>종류</Th>
                            <Th>거래일자</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transaction?.map((data, key) => {
                            return (
                                <Tr key={data.id}>
                                    <Td>{key + 1}</Td>
                                    <Td>{Number(data.amount).toLocaleString()} KRW</Td>
                                    <Td>{data.status}</Td>
                                    <Td>{data.type}</Td>
                                    <Td>{localTime(data.createdAt)}</Td>
                                </Tr>
                            )
                        })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>

    )
}

const Trades = ({ trades }: { trades: Recentrade[] | undefined }) => {
    const localTime = (time: string) => {
        const date = new Date(time)
        return date.toLocaleDateString() + ' ' + date.toLocaleString([], { hour: '2-digit', minute: '2-digit' })
    }
    return (
        <VStack p={5} maxH={'40vh'} borderColor={'black'} borderWidth={1} w={'100%'} >
            <Text fontSize={'large'}>Trades</Text>
            <TableContainer w={'100%'} overflowY={'scroll'}>
                <Table overflowY={'scroll'} size={"md"} variant={"striped"} colorScheme="cyan">
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>금액</Th>
                            <Th>PNL</Th>
                            <Th>종류</Th>
                            <Th>결과</Th>
                            <Th>거래일자</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {trades?.map((data, key) => {
                            return (
                                <Tr key={data.id}>
                                    <Td>{key + 1}</Td>
                                    <Td>{Number(data.tradeAmount).toLocaleString()} KRW</Td>
                                    <Td>{Number(data.tradePNL).toLocaleString()} KRW</Td>
                                    <Td>{data.type}</Td>
                                    <Td color={data.tradePNL > 0 ? "blue" : "red"}>{data.tradePNL > 0 ? '승' : '패'}</Td>
                                    <Td>{localTime(data.timeExecuted)}</Td>
                                </Tr>
                            )
                        })
                        }
                    </Tbody>
                </Table>
            </TableContainer>

        </VStack>
    )
}


export default User
