import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, message } from 'antd';
import Link from 'next/link';

import useInput from '../../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../../reducers/user';
import { FormWarraper } from './styled';
import Input from './Input';

const SignInForm = () => {
  const { logInLoading, logInError } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  const onDisabled = useMemo(() => !(email && email.trim() && password && password.trim()), [email, password]);

  useEffect(() => {
    if (logInError) {
      return message.error(logInError);
    }
  }, [logInError]);

  return (
    <FormWarraper onSubmit={onSubmitForm}>
      <Input placeholder="아이디" value={email} onChange={onChangeEmail} type="email" />
      <Input placeholder="비밀번호" value={password} onChange={onChangePassword} type="password" />
      <Button type="primary" htmlType="submit" loading={logInLoading} disabled={onDisabled}>
        로그인
      </Button>
      <div>
        <Link href="/signup">
          <a>아이디 찾기</a>
        </Link>
        {'  '}
        <Link href="/signup">
          <a>비밀번호 찾기</a>
        </Link>
      </div>
    </FormWarraper>
  );
};

export default SignInForm;
