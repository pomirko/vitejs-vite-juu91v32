import { useMemo, useState, useEffect, useRef } from 'react';
import { useMount, useUpdateEffect } from 'react-use';

import axios, { AxiosResponse } from 'axios';
import { Table, Image, Select } from 'antd';
import type { TableProps } from 'antd';
import CodeMirror from 'codemirror';

// Import the necessary CSS and modes
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript'; // Use appropriate mode based on your requirements
import 'codemirror/theme/material.css'; // Optional: Add themes

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const codeMirrorInstance = useRef<CodeMirror.Editor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      codeMirrorInstance.current = CodeMirror(editorRef.current, {
        value: `import { useMemo, useState } from 'react';
import { useMount, useUpdateEffect } from 'react-use';

import axios, { AxiosResponse } from 'axios';
import { Table, Image, Select } from 'antd';
import type { TableProps } from 'antd';

import './App.css';

enum Currencies {
  usd = 'usd',
  eur = 'eur',
}

enum Orders {
  market_cap_desc = 'market_cap_desc',
  market_cap_asc = 'market_cap_asc',
}

enum FilterTypes {
  currecny = 'currency',
  marketCap = 'marketCap',
}

type CurrencyProps = {
  id: string;
  name: string;
  current_price: string;
  circulating_supply: string;
  image: string;
};

type DataType = CurrencyProps[];

type FiltersProps = {
  vs_currency: Currencies;
  order: Orders;
  per_page: number;
  page: number;
};

type SelectFilterOptionsProps = { value: string; label: string };

type SelectFilterProps<T> = {
  defaultValue: T;
  handleChange: (value: T, type: FilterTypes) => void;
  options: SelectFilterOptionsProps[];
  type: FilterTypes;
};

const curreciesOptions = [
  { value: Currencies.usd, label: 'USD' },
  { value: Currencies.eur, label: 'EUR' },
];

const marketCapOptions = [
  { value: Orders.market_cap_desc, label: 'Market cap descending' },
  { value: Orders.market_cap_asc, label: 'Market cap ascending' },
];

const fetchDataFn = (
  params: FiltersProps
): Promise<AxiosResponse<DataType>> => {
  return axios.get(
    'https://api.coingecko.com/api/v3/coins/markets?sparkline=false',
    { params }
  );
};

const SelectFilterWrapper = <T extends Orders | Currencies>({
  defaultValue,
  handleChange,
  options,
  type,
}: SelectFilterProps<T>) => (
  <Select
    defaultValue={defaultValue}
    style={{ width: 'fit-content', minWidth: 240 }}
    onChange={(value) => handleChange(value, type)}
    options={options}
  />
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType>([]);
  const [filters, setFilters] = useState<FiltersProps>({
    vs_currency: Currencies.usd,
    order: Orders.market_cap_desc,
    per_page: 10,
    page: 1,
  });

  const tableColumns: TableProps<CurrencyProps>['columns'] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, coin: CurrencyProps) => (
          <div>
            <Image width={32} height={32} src={coin.image} /> {coin.name}
          </div>
        ),
      },
      {
        title: 'Current Price',
        dataIndex: 'current_price',
        key: 'current_price',
        render: (text) => (
          <span>
            {text} {filters.vs_currency}
          </span>
        ),
      },
      {
        title: 'Circulating Supply',
        dataIndex: 'circulating_supply',
        key: 'circulating_supply',
      },
    ],
    [filters.vs_currency]
  );

  const getData = async () => {
    await fetchDataFn(filters)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // alert('Error, try again');
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleChangeFilters = <T extends Orders | Currencies>(
    value: T,
    type: FilterTypes
  ) => {
    if (type === FilterTypes.currecny) {
      setFilters((state) => ({ ...state, vs_currency: value as Currencies }));
    }
    if (type === FilterTypes.marketCap) {
      setFilters((state) => ({ ...state, order: value as Orders }));
    }
  };

  const handleChangePagination = (page: number) =>
    setFilters((state) => ({ ...state, page }));

  const handlePageSizeChange = (currentPage: number, pageSize: number) =>
    setFilters((state) => ({
      ...state,
      page: currentPage,
      per_page: pageSize,
    }));

  useMount(() => {
    setIsLoading(true);
    getData();
  });

  useUpdateEffect(() => {
    setIsLoading(true);
    getData();
  }, [filters]);

  return (
    <div>
      <h1>Coins & Markets</h1>
      <SelectFilterWrapper
        defaultValue={Currencies.usd}
        handleChange={handleChangeFilters}
        options={curreciesOptions}
        type={FilterTypes.currecny}
      />
      <SelectFilterWrapper
        defaultValue={Orders.market_cap_desc}
        handleChange={handleChangeFilters}
        options={marketCapOptions}
        type={FilterTypes.marketCap}
      />

      <Table
        loading={isLoading}
        columns={tableColumns}
        dataSource={data}
        rowKey="id"
        pagination={{
          total: 10000,
          current: filters.page,
          pageSize: filters.per_page,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          onChange: handleChangePagination,
          onShowSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  );
};

export default App;`,
        mode: 'javascript',
        lineNumbers: true,
        theme: 'material',
      });
    }

    // Cleanup function to destroy CodeMirror instance
    return () => {
      if (codeMirrorInstance.current) {
        codeMirrorInstance.current.toTextArea();
      }
    };
  }, []);

  return (
    <div
      ref={editorRef}
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '200px',
      }}
    />
  );
};

import './App.css';

enum Currencies {
  usd = 'usd',
  eur = 'eur',
}

enum Orders {
  market_cap_desc = 'market_cap_desc',
  market_cap_asc = 'market_cap_asc',
}

enum FilterTypes {
  currecny = 'currency',
  marketCap = 'marketCap',
}

type CurrencyProps = {
  id: string;
  name: string;
  current_price: string;
  circulating_supply: string;
  image: string;
};

type DataType = CurrencyProps[];

type FiltersProps = {
  vs_currency: Currencies;
  order: Orders;
  per_page: number;
  page: number;
};

type SelectFilterOptionsProps = { value: string; label: string };

type SelectFilterProps<T> = {
  defaultValue: T;
  handleChange: (value: T, type: FilterTypes) => void;
  options: SelectFilterOptionsProps[];
  type: FilterTypes;
};

const curreciesOptions = [
  { value: Currencies.usd, label: 'USD' },
  { value: Currencies.eur, label: 'EUR' },
];

const marketCapOptions = [
  { value: Orders.market_cap_desc, label: 'Market cap descending' },
  { value: Orders.market_cap_asc, label: 'Market cap ascending' },
];

const fetchDataFn = (
  params: FiltersProps
): Promise<AxiosResponse<DataType>> => {
  return axios.get(
    'https://api.coingecko.com/api/v3/coins/markets?sparkline=false',
    { params }
  );
};

const SelectFilterWrapper = <T extends Orders | Currencies>({
  defaultValue,
  handleChange,
  options,
  type,
}: SelectFilterProps<T>) => (
  <Select
    defaultValue={defaultValue}
    style={{ width: 'fit-content', minWidth: 240 }}
    onChange={(value) => handleChange(value, type)}
    options={options}
  />
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType>([]);
  const [filters, setFilters] = useState<FiltersProps>({
    vs_currency: Currencies.usd,
    order: Orders.market_cap_desc,
    per_page: 10,
    page: 1,
  });

  const tableColumns: TableProps<CurrencyProps>['columns'] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, coin: CurrencyProps) => (
          <div>
            <Image width={32} height={32} src={coin.image} /> {coin.name}
          </div>
        ),
      },
      {
        title: 'Current Price',
        dataIndex: 'current_price',
        key: 'current_price',
        render: (text) => (
          <span>
            {text} {filters.vs_currency}
          </span>
        ),
      },
      {
        title: 'Circulating Supply',
        dataIndex: 'circulating_supply',
        key: 'circulating_supply',
      },
    ],
    [filters.vs_currency]
  );

  const getData = async () => {
    await fetchDataFn(filters)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // alert('Error, try again');
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleChangeFilters = <T extends Orders | Currencies>(
    value: T,
    type: FilterTypes
  ) => {
    if (type === FilterTypes.currecny) {
      setFilters((state) => ({ ...state, vs_currency: value as Currencies }));
    }
    if (type === FilterTypes.marketCap) {
      setFilters((state) => ({ ...state, order: value as Orders }));
    }
  };

  const handleChangePagination = (page: number) =>
    setFilters((state) => ({ ...state, page }));

  const handlePageSizeChange = (currentPage: number, pageSize: number) =>
    setFilters((state) => ({
      ...state,
      page: currentPage,
      per_page: pageSize,
    }));

  useMount(() => {
    setIsLoading(true);
    getData();
  });

  useUpdateEffect(() => {
    setIsLoading(true);
    getData();
  }, [filters]);

  return (
    <div>
      <h1>Coins & Markets</h1>
      <SelectFilterWrapper
        defaultValue={Currencies.usd}
        handleChange={handleChangeFilters}
        options={curreciesOptions}
        type={FilterTypes.currecny}
      />
      <SelectFilterWrapper
        defaultValue={Orders.market_cap_desc}
        handleChange={handleChangeFilters}
        options={marketCapOptions}
        type={FilterTypes.marketCap}
      />

      <Table
        loading={isLoading}
        columns={tableColumns}
        dataSource={data}
        rowKey="id"
        pagination={{
          total: 10000,
          current: filters.page,
          pageSize: filters.per_page,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          onChange: handleChangePagination,
          onShowSizeChange: handlePageSizeChange,
        }}
      />
      <CodeEditor />
    </div>
  );
};

export default App;
