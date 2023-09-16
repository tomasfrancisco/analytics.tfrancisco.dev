import { useMemo } from 'react';
import { Loading, Icon, Text, Button } from 'react-basics';
import Link from 'next/link';
import firstBy from 'thenby';
import classNames from 'classnames';
import useApi from 'components/hooks/useApi';
import { percentFilter } from 'lib/filters';
import useDateRange from 'components/hooks/useDateRange';
import usePageQuery from 'components/hooks/usePageQuery';
import ErrorMessage from 'components/common/ErrorMessage';
import ListTable from './ListTable';
import { DEFAULT_ANIMATION_DURATION } from 'lib/constants';
import Icons from 'components/icons';
import useMessages from 'components/hooks/useMessages';
import styles from './MetricsTable.module.css';
import useLocale from 'components/hooks/useLocale';

export function MetricsTable({
  websiteId,
  type,
  className,
  dataFilter,
  filterOptions,
  limit,
  onDataLoad,
  delay = null,
  ...props
}) {
  const [{ startDate, endDate, modified }] = useDateRange(websiteId);
  const {
    resolveUrl,
    router,
    query: { url, referrer, title, os, browser, device, country, region, city },
  } = usePageQuery();
  const { formatMessage, labels } = useMessages();
  const { get, useQuery } = useApi();
  const { dir } = useLocale();

  const { data, isLoading, isFetched, error } = useQuery(
    [
      'websites:metrics',
      {
        websiteId,
        type,
        modified,
        url,
        referrer,
        os,
        title,
        browser,
        device,
        country,
        region,
        city,
      },
    ],
    () => {
      const filters = { url, title, referrer, os, browser, device, country, region, city };

      filters[type] = undefined;

      return get(`/websites/${websiteId}/metrics`, {
        type,
        startAt: +startDate,
        endAt: +endDate,
        ...filters,
      });
    },
    { onSuccess: onDataLoad, retryDelay: delay || DEFAULT_ANIMATION_DURATION },
  );

  const filteredData = useMemo(() => {
    if (data) {
      let items = data;

      if (dataFilter) {
        if (Array.isArray(dataFilter)) {
          items = dataFilter.reduce((arr, filter) => {
            return filter(arr);
          }, items);
        } else {
          items = dataFilter(data);
        }
      }

      items = percentFilter(items);

      if (limit) {
        items = items.filter((e, i) => i < limit);
      }
      if (filterOptions?.sort === false) {
        return items;
      }

      return items.sort(firstBy('y', -1).thenBy('x'));
    }
    return [];
  }, [data, error, dataFilter, filterOptions, limit]);

  return (
    <div className={classNames(styles.container, className)}>
      {!data && isLoading && !isFetched && <Loading icon="dots" />}
      {error && <ErrorMessage />}
      {data && !error && <ListTable {...props} data={filteredData} className={className} />}
      <div className={styles.footer}>
        {data && !error && limit && (
          <Link href={router.pathname} as={resolveUrl({ view: type })}>
            <Button variant="quiet">
              <Text>{formatMessage(labels.more)}</Text>
              <Icon size="sm" rotate={dir === 'rtl' ? 180 : 0}>
                <Icons.ArrowRight />
              </Icon>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default MetricsTable;
