import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { Optional } from 'typescript-optional';
const { ofNullable } = Optional;

interface SwitchProps {
  nav: string;
  defaultComponent?: JSX.Element;
  children?: JSX.Element[];
}

export const Navigation: FunctionComponent<SwitchProps> = (props) => {
  const defaultComponent = props.defaultComponent ? (
    props.defaultComponent
  ) : props.children && props.children.length > 0 ? (
    props.children[0]
  ) : (
    <></>
  );
  return ofNullable(props.children)
    .map((children) => {
      return ofNullable((children as JSX.Element[]).find((child) => child.props['nav'] === props.nav)).orElse(
        defaultComponent
      );
    })
    .orElseThrow(() => new Error('Children are required for a switch component'));
};
export const Navigate = (props: { nav: string; children: ReactNode }) => {
  return props.children;
};
// const Foo = ({ value = 'foo' }) => <div>foo</div>;
// const Bar = ({ value = 'bar' }) => <div>bar</div>;
// const value = 'foo';
// const SwitchExample = (
//   <Switch test={value} defaultComponent={<div />}>
//     <Foo />
//     <Bar />
//   </Switch>
// );
