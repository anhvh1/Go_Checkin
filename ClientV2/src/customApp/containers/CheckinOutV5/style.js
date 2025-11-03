import styled from "styled-components";

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #fafbfc;

  .status-checkin {
    text-align: center;
    padding:  0 20px;
  }
  .face-wrapper {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    align-items: center;
  }

  #capture-camera {
    border-radius: 50%;
  }

  #detect-canvas {
    display: none;
  }

  .left-panel {
    flex: 1.2;
    min-height: 750px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0 32px 0;
    background: #fff;
    border-radius: 0 24px 24px 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    position: relative;
    

    .spin-container {
      width: 100%;
      height: 98%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background: rgba(255,255,255,0.8);
      z-index: 1000;
    }

    .greeting-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 34px;
      color: #222;
      text-align: center;
      letter-spacing: 1px;
    }

    .greeting-prompt {
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 20px;
      color: #555;
      text-align: center;
    }
  }

  .greeting-avatar {
    margin-bottom: 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }

  .greeting-name {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #333;
    text-align: center;
  }

  .greeting-cccd, .greeting-checkin {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #555;
    text-align: center;
    display: block;
  }

  .stats-row {
    display: flex;
    flex-direction: row;
    gap: 24px;
    margin: 34px 0 0 0;
    width: 100%;
    justify-content: center;
  }

  .stat-card {
    background: #f6f8fa;
    border-radius: 16px;
    padding: 24px 36px;
    min-width: 180px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a237e;
  }

  .stat-label {
    font-size: 1rem;
    color: #888;
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
  }

  .fake-btn {
    margin-top: 20px;
    font-size: 1rem;
    padding: 8px 24px;
    border-radius: 8px;
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
    padding: 32px;
    min-width: 320px;
    max-width: 520px;
    height: 100vh;

    .list-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #222;
      text-align: left;
    }

    .customer-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 80vh;
      justify-content: flex-start;
      overflow-y: auto;
    }

    .customer-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 16px 20px;
      min-height: 80px;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      }
    }

    .customer-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .customer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .customer-name {
        font-size: 1.2rem;
        font-weight: 700;
        color: #222;
      }

      .customer-cccd {
        font-size: 1rem;
        font-weight: 600;
        color: #1a237e;
      }

      .customer-checkin {
        font-size: 0.9rem;
        color: #555;
      }
    }

    .empty-list {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      font-size: 1.3rem;
      color: #aaa;
      font-weight: 500;
      background: #f6f8fa;
      border-radius: 12px;
    }
  }

  /* Responsive */
  @media (max-width: 1200px) {
    flex-direction: column;
    .customer-list {
      min-height: auto !important;
    }
    .left-panel, .right-panel {
      width: 100%;
      border-radius: 0 0 24px 24px;
      min-height: auto;
    }

    .left-panel {
      padding: 32px 16px;
    }

    .right-panel {
      padding: 24px 16px;
      max-width: 100%;
      height: auto;
    }
  }

  @media (max-width: 768px) {
    .greeting-title {
      font-size: 2rem;
    }

    .greeting-prompt {
      font-size: 1.4rem;
    }

    .greeting-name {
      font-size: 1.6rem;
    }

    .stat-card {
      font-size: 1.5rem;
      padding: 20px 28px;
    }

    .customer-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 12px 16px;
    }

    .customer-avatar {
      width: 48px;
      height: 48px;
    }

    .customer-info .customer-name {
      font-size: 1.1rem;
    }

    .customer-info .customer-cccd {
      font-size: 0.95rem;
    }

    .customer-info .customer-checkin {
      font-size: 0.85rem;
    }
  }
`;
