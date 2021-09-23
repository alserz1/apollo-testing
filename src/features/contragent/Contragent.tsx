import { memo } from 'react';
import { gql } from "@apollo/client";
import { GetContragentFragment } from './__generated__/GetContragentFragment';

export const contragentFragment = gql`
  fragment GetContragentFragment on Contragent {
    id
    name
  }
`;
interface IProps {
  contragent: GetContragentFragment;
}


export const Contragent = memo(function Contragent(props: IProps) {
  return <span>{props.contragent.name}</span>;
});
