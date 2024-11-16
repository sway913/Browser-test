/* Copyright (c) 2021-2024 Damon Smith */

import * as React from 'react';
import { Title, Row, Header } from '../App/style';
import { observer } from 'mobx-react-lite';

const Location = observer(() => {
  return (
    <Row>
      <Title>
        LunarWolf is a privacy orientated browser with tons of features such as a
        built in Ad Blocker, full chromium extension support, being able to change your privacy settings whenever and wherever,
        and includes modern APIs for website compatibility
      </Title>
    </Row>
  );
});

export const About = () => {
  return (
    <>
      <Header>About Lunarwolf Browser</Header>
      <Title>Your version of lunarwolf is v1.0.1-beta.3</Title>
      <Location />
    </>
  );
};
