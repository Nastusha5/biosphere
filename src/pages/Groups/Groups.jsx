
import React, { useState, useEffect } from 'react';
import styles from './Groups.module.css';
import * as FaIcons from 'react-icons/fa';
import GroupModal from './GroupModal';
import StudentModal from './StudentModal';
import * as groupsApi from '../../api/groupsApi';

const Groups = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(null);

  useEffect(() => {
    if (user) {
        fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await groupsApi.getGroups(user.uid);
      const sortedGroups = await Promise.all(fetchedGroups.map(async (group) => {
        const students = await groupsApi.getStudentsByGroup(group.id);
        const sortedStudents = students.sort((a, b) => {
            const lastNameA = a.lastName || '';
            const lastNameB = b.lastName || '';
            const firstNameA = a.firstName || '';
            const firstNameB = b.firstName || '';

            if (lastNameA.localeCompare(lastNameB) !== 0) {
                return lastNameA.localeCompare(lastNameB);
            }
            return firstNameA.localeCompare(firstNameB);
        });
        return { ...group, students: sortedStudents };
      }));
      setGroups(sortedGroups);
    } catch (error) {
      alert('Error fetching groups!');
    }
  };

  const toggleAccordion = (groupId) => {
    setOpenAccordion(openAccordion === groupId ? null : groupId);
  };

  const handleOpenGroupModal = (group = null) => {
    setEditingGroup(group);
    setGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setGroupModalOpen(false);
    setEditingGroup(null);
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (groupData.id) {
        await groupsApi.updateGroup(groupData.id, groupData.name);
      } else {
        await groupsApi.createGroup(groupData.name, user.uid);
      }
      fetchGroups();
      handleCloseGroupModal();
    } catch (error) {
      alert('Error saving group!');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await groupsApi.deleteGroup(groupId);
      fetchGroups();
    } catch (error) {
      alert('Error deleting group!');
    }
  };

  const handleOpenStudentModal = (student = null, groupId) => {
    setEditingStudent(student);
    setActiveGroupId(groupId);
    setStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setStudentModalOpen(false);
    setEditingStudent(null);
    setActiveGroupId(null);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      const { id, firstName, lastName } = studentData;
      if (id) {
        await groupsApi.updateStudent(activeGroupId, id, { firstName, lastName });
      } else {
        await groupsApi.createStudent(activeGroupId, { firstName, lastName });
      }
      fetchGroups();
      handleCloseStudentModal();
    } catch (error) {
      alert('Error saving student!');
    }
  };

  const handleDeleteStudent = async (studentId, groupId) => {
    try {
      await groupsApi.deleteStudent(groupId, studentId);
      fetchGroups();
    } catch (error) {
      alert('Error deleting student!');
    }
  };

  const handlePrint = (group) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>${group.name} - Student Passwords</h1>`);
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr><th>Прізвище та ім\'я</th><th>Пароль</th></tr></thead>');
    printWindow.document.write('<tbody>');
    const students = group.students || [];
    students.forEach(student => {
      printWindow.document.write(`<tr><td>${student.lastName} ${student.firstName}</td><td>${student.password}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.groupsContainer}>
      {isGroupModalOpen && (
        <GroupModal
          group={editingGroup}
          onSave={handleSaveGroup}
          onClose={handleCloseGroupModal}
        />
      )}
      {isStudentModalOpen && (
        <StudentModal
          student={editingStudent}
          onSave={handleSaveStudent}
          onClose={handleCloseStudentModal}
        />
      )}
      <div className={styles.header}>
        <button className={styles.createGroupButton} onClick={() => handleOpenGroupModal()}>Створити групу</button>
      </div>

      <div className={styles.accordion}>
        {groups.map((group) => (
          <div key={group.id} className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleAccordion(group.id)}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <div className={styles.groupActions}>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); handleOpenGroupModal(group); }}><FaIcons.FaEdit /></button>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}><FaIcons.FaTrash /></button>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); handlePrint(group); }}><FaIcons.FaPrint /></button>
                <span className={`${styles.accordionIcon} ${openAccordion === group.id ? styles.open : ''}`}>
                  <FaIcons.FaChevronDown />
                </span>
              </div>
            </div>
            {openAccordion === group.id && (
              <div className={styles.accordionContent}>
                <div className={styles.studentListHeader}>
                  <h4>Учні</h4>
                  <button className={styles.addStudentButton} onClick={() => handleOpenStudentModal(null, group.id)}>Додати учня</button>
                </div>
                <table className={styles.studentsTable}>
                  <thead>
                    <tr>
                      <th>Прізвище та ім'я</th>
                      <th>Пароль</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                  {group.students && group.students.map(student => (
                    <tr key={student.id}>
                      <td>{`${student.lastName} ${student.firstName}`}</td>
                      <td>{student.password}</td>
                      <td>
                        <button className={styles.actionButton} onClick={() => handleOpenStudentModal(student, group.id)}><FaIcons.FaEdit /></button>
                        <button className={styles.actionButton} onClick={() => handleDeleteStudent(student.id, group.id)}><FaIcons.FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
