import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../../settings/style-util';

const Pagination = ComponentName => styled(ComponentName)`
  &.ant-pagination {
    .ant-pagination-item {
      margin: 3px 8px 3px 0;
      &.ant-pagination-item-active {
        background-color: ${palette('primary', 14)};
        border-color: ${palette('primary', 14)};

        a {
          color: #ffffff;
        }

        &:hover {
          background-color: ${palette('primary', 14)};
          a {
            color: #ffffff;
          }
        }
      }

      &:hover {
        border-color: ${palette('primary', 14)};
        ${transition()};
      }

      &:hover a {
        color: ${palette('primary', 14)};
      }
    }
    
    .ant-pagination-prev:hover .ant-pagination-item-link, {
        color: ${palette('primary', 14)};
        border-color: ${palette('primary', 14)};
    }

    .ant-pagination-total-text {
      margin: 3px 8px 3px 0;
    }

    .ant-pagination-prev,
    .ant-pagination-next,
    .ant-pagination-jump-prev,
    .ant-pagination-jump-next {
      margin: 3px 8px 3px 0;
    }

    .ant-pagination-prev:hover,
    .ant-pagination-next:hover,
    .ant-pagination-jump-next:hover,
    .ant-pagination-jump-next-custom-icon:hover {
      border-color: ${palette('primary', 14)};

      a {
        color: ${palette('primary', 14)};
      }
    }

    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
      transform: rotate(0);
    }

    .ant-pagination-jump-prev,
    .ant-pagination-jump-next {
      &:after {
        transform: rotate(0) scale(0.66666667);
      }
    }

    &.ant-pagination-simple {
      .ant-pagination-prev,
      .ant-pagination-next {
        margin: 0;
      }

      .ant-pagination-simple-pager {
        margin: 3px 8px 3px 0;
      }
    }

    .ant-pagination-options {
      margin: 3px 0 3px 10px;

      .ant-select .ant-select-selection.ant-select-selection--single {
        height: 28px;

        .ant-select-selection__rendered {
          line-height: 28px;
        }
      }

      .ant-pagination-options-size-changer {
        margin: 0 8px 0 0;
      }
    }
  }
`;

export default Pagination;
