import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Table } from "../../components/ui/table";

const TablePage: NextPage = () => {
  const { query, isReady } = useRouter();
  if (!isReady) return <div />;

  return <Table id={query.id as string} />;
};

export default TablePage;
