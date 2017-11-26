import styled from 'styled-components';
import {Link} from 'react-router';

/**
 * Banner
 */
const Banner = styled.main`
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  padding: 0 2rem;
  color: #fff;
  background-color: #3f51b5;
  box-shadow: 0 2px 4px fade(#000, 20%);
  transform: translateY(0);
  transition: transform 300ms;
`;

/**
 * Header
 */
Banner.Header = styled.header`
  max-width: 1200px;
  margin: 0 auto;
`;

Banner.Header.Logo = styled.div`
  float: left;
  margin-left: -1rem;
  font-size: 2rem;
  font-weight: 400;
`;

export {Banner};
