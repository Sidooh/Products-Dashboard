import { Card } from 'react-bootstrap';
import { useSubscriptionTypesQuery } from 'features/subscription-types/subscriptionTypesApi';
import { currencyFormat, DataTable, SectionError, SectionLoader } from '@nabcellent/sui-react';
import { SubscriptionType } from 'utils/types';
import pluralize from 'pluralize';

const SubscriptionTypes = () => {
    let { data: subTypes, isLoading, isSuccess, isError, error } = useSubscriptionTypesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !subTypes) return <SectionLoader/>;

    console.log(subTypes);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Subscription Types'} columns={[
                    {
                        accessorKey: 'title',
                        header: 'Title',
                    },
                    {
                        accessorKey: 'price',
                        header: 'Price',
                        accessorFn: (row: SubscriptionType) => currencyFormat(row.price)
                    },
                    {
                        accessorKey: 'duration',
                        header: 'Duration',
                        accessorFn: (row: SubscriptionType) => `${row.duration} ${pluralize(row.period, row.duration)
                            .toUpperCase()}`,
                    },
                    {
                        accessorKey: 'level_limit',
                        header: 'Level Limit',
                    }
                ]} data={subTypes}/>
            </Card.Body>
        </Card>
    );
};

export default SubscriptionTypes;
