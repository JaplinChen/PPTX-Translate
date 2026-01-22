# 命令自動執行偏好 (Auto-Run Commands)

對於以下類型的命令，請設定 `SafeToAutoRun: true`，無需詢問確認：

**Docker 相關：**

- docker compose up/down/restart/logs/ps/build
- docker logs/ps/exec
- docker-compose up/down/restart/logs/ps/build
- docker-compose up -d --build
- npm test 2>&1

**讀取類命令：**

- cat、ls、grep、find、head、tail、wc
- git status/log/diff/branch
- python
- dir

**這是開發環境，以上命令可以安全自動執行，無需手動 Accept。**

**自動化規則 (高優先權)：**

- **強制自動更新**：每次代碼修正 (Fix)、功能變更 (Feature) 或樣式調整 (UI) 後，**必須立即且自動**執行 `./start_docker.sh` 或 `/deploy` 工作流程，且自動 Accept。
- **無需詢問**：所有 讀取類命令和 Docker 相關指令皆設為 `SafeToAutoRun: true`。
- **持續部署**：確保本地開發環境與 Docker 容器狀態始終保持同步。
