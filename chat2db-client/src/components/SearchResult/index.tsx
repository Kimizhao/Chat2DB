import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import TabsNew from '@/components/TabsNew';
import Iconfont from '@/components/Iconfont';
import StateIndicator from '@/components/StateIndicator';
import Output from '@/components/Output';
import { IManageResultData } from '@/typings';
import TableBox from './TableBox';
import styles from './index.less';
import EmptyImg from '@/assets/img/empty.svg';
import i18n from '@/i18n';

interface IProps {
  className?: string;
  queryResultDataList?: IManageResultData[];
  executeSqlParams: any;
}

export default memo<IProps>((props) => {
  const { className, queryResultDataList = [] } = props;
  const [currentTab, setCurrentTab] = useState<string | number | undefined>();
  const [resultDataList, setResultDataList] = useState<IManageResultData[]>(queryResultDataList);

  useEffect(() => {
    setCurrentTab(queryResultDataList[0]?.uuid);
  }, [queryResultDataList]);

  const onChange = useCallback(() => {
    // setCurrentTab(uuid);
  }, []);

  const renderTable = (queryResultData) => {
    if (queryResultData.success) {
      return (
        <TableBox
          key={queryResultData.uuid}
          outerQueryResultData={queryResultData}
          executeSqlParams={props.executeSqlParams}
        />
      );
    } else {
      return (
        <StateIndicator
          className={styles.stateIndicator}
          key={queryResultData.uuid}
          state="error"
          text={queryResultData.message}
        />
      );
    }
  };

  const tabsList = useMemo(() => {
    return resultDataList.map((queryResultData, index) => {
      return {
        prefixIcon: (
          <Iconfont
            key={index}
            className={classnames(styles[queryResultData.success ? 'successIcon' : 'failIcon'], styles.statusIcon)}
            code={queryResultData.success ? '\ue605' : '\ue87c'}
          />
        ),
        popover: queryResultData.originalSql,
        label: queryResultData.originalSql,
        key: queryResultData.uuid!,
        children: renderTable(queryResultData),
      };
    });
  }, [resultDataList]);

  const onEdit = useCallback(
    (type: 'add' | 'remove', value) => {
      if (type === 'remove') {
        const newResultDataList = resultDataList.filter((d) => d.uuid !== value.key);
        setResultDataList(newResultDataList);
      }
    },
    [resultDataList],
  );

  const outputTabAndTabsList = useMemo(() => {
    const params = {
      pageNo: 1,
      pageSize: 10,
    };

    return [
      {
        prefixIcon: <Iconfont key="output" className={styles.outputPrefixIcon} code="&#xe6bb;" />,
        label: 'Output',
        key: 'output',
        children: <Output params={params} />,
        styles: { width: '80px' },
        canClosed: false,
      },
      ...tabsList,
    ];
  }, [tabsList]);

  return (
    <div className={classnames(className, styles.searchResult)}>
      {tabsList.length ? (
        <TabsNew
          hideAdd
          // concealTabHeader={outputTabAndTabsList?.length === 1}
          className={styles.tabs}
          onChange={onChange as any}
          activeKey={currentTab}
          onEdit={onEdit as any}
          items={tabsList}
        />
      ) : (
        <div className={styles.noData}>
          <img src={EmptyImg} />
          <p>{i18n('common.text.noData')}</p>
        </div>
      )}
    </div>
  );
});
