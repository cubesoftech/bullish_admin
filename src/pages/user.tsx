import { useRouter } from 'next/router';
import React from 'react'
import { prisma } from '@/utils';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import useSWR from 'swr';
import { Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';

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


function user() {
    //access the query
    const router = useRouter();
    const { id } = router.query;
    const { data, error, isLoading } = useSWR<Root>(`/api/getUserDetails?id=${id}`, async (url: string) => {
        const res = await fetch(url);
        return res.json();
    })
    if (isLoading) {
        return (
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
        )
    }
    return (
        <VStack p={5} spacing={2} alignItems={"flex-start"} >
            <Text fontSize={'large'}>User Id: {data?.member.email}</Text>
            <Text fontSize={'large'}>Balance: {Number(data?.member.balance).toLocaleString()} KRW</Text>
            <Transaction transaction={data?.tansactions} />
            <Trades trades={data?.recentrades} />
        </VStack>
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
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Type</Th>
                            <Th>Date</Th>
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
                            <Th>Amount</Th>
                            <Th>PNL</Th>
                            <Th>Type</Th>
                            <Th>Result</Th>
                            <Th>Date</Th>
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
                                    <Td>{data.trade ? 'Win' : 'Lose'}</Td>
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


export default user
