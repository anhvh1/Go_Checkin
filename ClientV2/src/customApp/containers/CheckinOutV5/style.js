import styled from "styled-components";

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #fafbfc;

  #capture-camera {
    border-radius: 50%;
  }

  #detect-canvas {
    display: none;
  }

  .left-panel {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0 32px 0;
    background: #fff;
    border-radius: 0 24px 24px 0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    position:relative ;

    .spin-container {
      width:100% ;
      height:98%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background: rgba(255,255,255,0.8);
      /* top: 50%;
      left: 50%; */
      z-index: 1000;
    }

    .greeting-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 32px;
      color: #222;
      text-align: center;
      letter-spacing: 1px;
    }
    .greeting-prompt{
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 24px;
      color: #555;
      text-align: center;
    }
  }

    .greeting-avatar {
      margin-bottom: 24px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .greeting-name {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #333;
      text-align: center;
    }
    .greeting-cccd, .greeting-checkin {
      font-size: 1.3rem;
      margin-bottom: 10px;
      color: #555;
      text-align: center;
      display: block;
    }
    .stats-row {
      display: flex;
      flex-direction: row;
      gap: 32px;
      margin: 32px 0 0 0;
      width: 100%;
      justify-content: center;
    }
    .stat-card {
      background: #f6f8fa;
      border-radius: 16px;
      padding: 32px 48px;
      min-width: 220px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      font-size: 2.2rem;
      font-weight: 700;
      color: #1a237e;
    }
    .stat-label {
      font-size: 1.1rem;
      color: #888;
      font-weight: 500;
      margin-bottom: 8px;
      display: block;
    }
    .fake-btn {
      margin-top: 24px;
      font-size: 1.2rem;
      padding: 10px 32px;
      border-radius: 8px;
    }
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
    padding: 48px 32px 32px 32px;
    min-width: 400px;
    max-width: 520px;
    height: 100vh;
    /* overflow-y: auto; */

    .list-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 24px;
      color: #222;
      text-align: left;
    }
    .customer-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-height: 60vh;
      justify-content: flex-start;
      overflow-y: auto;
    }
    .customer-card {
      display: flex;
      align-items: center;
      gap: 18px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 18px 24px;
      min-height: 96px;
      transition: box-shadow 0.2s;
      &:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      }
    }
    .customer-avatar {
      width: 64px;
      height: 64px;
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
        font-size: 1.3rem;
        font-weight: 700;
        color: #222;
      }
      .customer-cccd {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1a237e;
      }
      .customer-checkin {
        font-size: 1rem;
        color: #555;
      }
    }
    .empty-list {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      font-size: 1.5rem;
      color: #aaa;
      font-weight: 500;
      background: #f6f8fa;
      border-radius: 12px;
    }
  }
`;
